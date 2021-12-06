import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of} from 'rxjs';
import {CoursesService} from './courses.service';
import {first, tap} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';
import {makeStateKey, TransferState} from '@angular/platform-browser';


@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(private coursesService: CoursesService,
              private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseId = route.params.id;

    const COURSE_KEY = makeStateKey<Course>(courseId);

    if (this.transferState.hasKey(COURSE_KEY)) { // no need to call the backend again, since we have the course
      // stored on transferState

      const course = this.transferState.get(COURSE_KEY, null);
      this.transferState.remove(COURSE_KEY);  // cleaning up the transferState
      return of(course);

    } else {  // since there is no course on transferState, we are probably on the server here fetching course for
      // the first time

      return this.coursesService.findCourseById(courseId)
        .pipe(
          first(),
          tap(course => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(COURSE_KEY, course);
            }
          })
        );
    }


  }

}
