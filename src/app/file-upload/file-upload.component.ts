import { Component, Input } from '@angular/core';

@Component({
    selector: 'file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['file-upload.component.scss'],
})
export class FileUploadComponent {
    @Input() requiredFileType: string;
    filename = '';

    onFileSelected(event): void {
        const file: File = event.target.files[0];

        if (file) {
            this.filename = file.name;

            console.log(this.filename);
        }
    }
}
