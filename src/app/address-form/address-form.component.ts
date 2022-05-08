import { Component, Input, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AddressFormComponent,
        },
    ],
})
export class AddressFormComponent implements ControlValueAccessor, OnDestroy {
    @Input()
    legend: string;

    form: FormGroup = this.fb.group({
        addressLine1: [null, [Validators.required]],
        addressLine2: [null, [Validators.required]],
        zipCode: [null, [Validators.required]],
        city: [null, [Validators.required]],
    });

    onChangeSubscription: Subscription;

    constructor(private fb: FormBuilder) {}

    onChange = () => {};

    onTouched = () => {};

    ngOnDestroy() {
        this.onChangeSubscription.unsubscribe();
    }

    registerOnChange(onChange: any) {
        this.onChangeSubscription = this.form.valueChanges.subscribe(onChange);
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    writeValue(value: any) {
        if (value) {
            this.form.setValue(value);
        }
    }
}
