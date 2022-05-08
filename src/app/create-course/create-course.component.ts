import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'create-course',
    templateUrl: './create-course.component.html',
    styleUrls: ['./create-course.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {
                showError: true,
            },
        },
    ],
})
export class CreateCourseComponent implements OnInit {
    ngOnInit() {}

    onStep3Submit(step1, step2, step3) {
        console.log('clicked ', step1, step2, step3);
    }
}
