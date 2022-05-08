import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
    selector: 'file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: FileUploadComponent,
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: FileUploadComponent,
        },
    ],
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
    @Input() requiredFileType: string;

    disabled = false;

    filename = '';

    fileUploadError = false;

    fileUploadSuccess = false;

    uploadProgress: number;

    constructor(private http: HttpClient) {}

    onValidatorChange = () => {};

    onChange = (fileName: string) => {};

    onClick(element: HTMLInputElement): void {
        this.onTouched();
        element.click();
    }

    onFileSelected(event): void {
        const file: File = event.target.files[0];

        // TODO: add filetype check and error handling

        if (file) {
            this.filename = file.name;

            console.log(this.filename);

            const formData = new FormData();

            formData.append('thumbnail', file);

            this.fileUploadError = false;

            this.http
                .post('/api/thumbnail-upload', formData, {
                    reportProgress: true,
                    observe: 'events',
                })
                .pipe(
                    catchError((error) => {
                        this.fileUploadError = true;

                        return of(error);
                    }),
                    finalize(() => {
                        this.uploadProgress = null;
                    })
                )
                .subscribe((httpEvent) => {
                    if (httpEvent.type === HttpEventType.UploadProgress) {
                        this.uploadProgress = Math.round(
                            100 * (httpEvent.loaded / httpEvent.total)
                        );
                    } else if (httpEvent.type === HttpEventType.Response) {
                        this.fileUploadSuccess = true;
                        this.onChange(this.filename);
                        this.onValidatorChange();
                    }
                });
        }
    }

    onTouched = () => {};

    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    writeValue(value: string): void {
        this.filename = value;
    }

    registerOnValidatorChange(fn: () => void) {
        this.onValidatorChange = fn;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.fileUploadSuccess) {
            return null;
        }

        const errors: any = {
            requiredFileType: this.requiredFileType,
        };
        if (this.fileUploadError) {
            errors.uploadFailed = true;
        }
        return errors;
    }
}
