import {Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef} from '@angular/core';
import {isPlatformServer} from '@angular/common';


@Directive({
  selector: '[appShellRender]'
})
export class AppShellRenderDirective implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);  // instantiation the template in the view
    } else {
      this.viewContainer.clear();
    }
  }

}


