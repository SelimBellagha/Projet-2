import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Message } from '@common/chatMessage';
import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let mockActivatedRoute: unknown;
    let mockSocketService: any;
    let mockGameUtils: unknown;

    beforeEach(async () => {
        mockActivatedRoute = {
            snapshot: {
                routeConfig: {
                    path: 'test',
                },
            },
        };
        mockSocketService = jasmine.createSpyObj(['connect', 'on', 'send']);
        mockGameUtils = jasmine.createSpyObj(['getGameId']);

        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => 'someValue',
                            },
                        },
                    },
                },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: SocketClientService, useValue: mockSocketService },
                { provide: LoginFormService, useValue: mockGameUtils },
            ],
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should connect to the socket on init', () => {
        component.ngOnInit();
        expect(mockSocketService.connect).toHaveBeenCalled();
    });

    it('should handle chat message sockets', () => {
        const message: Message = {
            text: 'Hello',
            roomId: '123',
            isSender: false,
            isSystem: false,
            name: 'John Doe',
        };
        const spy = spyOn(component.messages, 'push');

        mockSocketService.on.and.callFake((event: string, callback: Function) => {
            if (event === 'receiveChatMessage') {
                callback(message);
            }
        });

        component.ngOnInit();

        expect(mockSocketService.on).toHaveBeenCalledWith('receiveChatMessage', jasmine.any(Function));
        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should add a message when calling addMessage', () => {
        const message: Message = {
            text: 'Hello',
            roomId: '123',
            isSender: true,
            isSystem: false,
            name: '',
        };

        component.message = message.text;

        mockSocketService.send.and.callFake((event: string, data: unknown) => {
            expect(event).toBe('sendChatToServer');
            expect(data).toEqual(message);
        });

        component.addMessage();

        expect(component.messages).toEqual([message]);
        expect(component.message).toBe('');
    });
});
