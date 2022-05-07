import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { map } from 'rxjs/operators';

export function courseTitleValidator(
    courses: CoursesService
): AsyncValidatorFn {
    return (control: AbstractControl) => {
        return courses.findAllCourses().pipe(
            map((coursesArr) => {
                const courseExists = coursesArr.find(
                    (course) =>
                        course.description.toLowerCase() ===
                        control.value.toLowerCase()
                );
                return courseExists ? { titleExists: true } : null;
            })
        );
    };
}
