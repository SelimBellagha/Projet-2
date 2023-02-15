import { TestBed } from '@angular/core/testing';

import { LoginFormService } from './login-form.service';

describe('LoginFormService', () => {
    let service: LoginFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoginFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the form data', () => {
        const name = 'TestName';
        service.setFormData(name);
        expect(service.getFormData()).toEqual(name);
    });
});
