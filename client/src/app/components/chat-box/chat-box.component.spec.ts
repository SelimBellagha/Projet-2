import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call addMessage on key down', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(component, 'addMessage');
        component.onKeyDown(event);
        expect(component.addMessage).toHaveBeenCalled();
    });

    it('should return true when the pageName is "oneVSone"', () => {
        component.pageName = 'oneVSone';
        const result = component.isMultiplayerMode();
        expect(result).toBeTrue();
    });

    it('should return false when the pageName is not "oneVSone"', () => {
        component.pageName = 'someOtherPage';
        const result = component.isMultiplayerMode();
        expect(result).toBeFalse();
    });

    it('should return current time in "hh:mm:ss" format', () => {
        const currentTime = component.getCurrentTime();
        const pattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        expect(pattern.test(currentTime)).toBe(true);
    });
});
