import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MouseFocusService } from '@app/mouse-focus.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Message } from '@common/chatMessage';
import { ChatBoxComponent } from './chat-box.component';
import SpyObj = jasmine.SpyObj;

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let mockActivatedRoute: unknown;
    let mockSocketService: SpyObj<SocketClientService>;
    let mouseFocusSpy: SpyObj<MouseFocusService>;
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
        mouseFocusSpy = jasmine.createSpyObj('MouseFocusService', [], { isFocusOnChat: false });
        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: SocketClientService, useValue: mockSocketService },
                { provide: LoginFormService, useValue: mockGameUtils },
                { provide: MouseFocusService, useValue: mouseFocusSpy },
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
        /* eslint-disable */
        mockSocketService.on.and.callFake((event: string, callback: any) => {
            if (event === 'receiveChatMessage') {
                callback(message);
            }
        });
        /* eslint-enable */
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
        component.gameId = message.roomId;
        component.addMessage();
        expect(mockSocketService.send).toHaveBeenCalledWith('sendChatToServer', jasmine.any(Object));
        expect(component.message).toBe('');
    });

    it('should handle system message sockets', () => {
        const message: Message = {
            text: 'The game has started!',
            roomId: '123',
            isSender: false,
            isSystem: true,
            name: '',
        };
        const spy = spyOn(component.messages, 'push');
        /* eslint-disable */
        mockSocketService.on.and.callFake((event: string, callback: any) => {
          if (event === 'receiveSystemMessage') {
            callback(message);
          }
        });
        /* eslint-enable */
        component.ngOnInit();

        expect(mockSocketService.on).toHaveBeenCalledWith('receiveSystemMessage', jasmine.any(Function));
        expect(spy).toHaveBeenCalled();
    });
    it('onFocus should change isFocusOnchat to true ', () => {
        mouseFocusSpy.isFocusOnchat = false;
        component.onFocus();
        expect(mouseFocusSpy.isFocusOnchat).toBeTrue();
    });
    it('onBlur should change isFocusOnchat to false ', () => {
        mouseFocusSpy.isFocusOnchat = true;
        component.onBlur();
        expect(mouseFocusSpy.isFocusOnchat).toBeFalse();
    });
    it('formatTime should return "03" if time input is 3', () => {
        expect(component.formatTime(3)).toEqual('03');
    });
    it('formatTime should return "11" if time input is 11', () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.formatTime(11)).toEqual('11');
    });
    it('should handle solo systemMessage if gamemode is solo', () => {
        const message: Message = {
            text: 'Hello',
            roomId: '123',
            isSender: false,
            isSystem: false,
            name: 'John Doe',
        };
        const spy = spyOn(component.messages, 'push');
        spyOn(component, 'isMultiplayerMode').and.returnValue(false);
        /* eslint-disable */
        mockSocketService.on.and.callFake((event: string, callback: any) => {
            if (event === 'receiveSystemMessageSolo') {
                callback(message);
            }
        });
        /* eslint-enable */
        component.ngOnInit();

        expect(mockSocketService.on).toHaveBeenCalledWith('receiveSystemMessageSolo', jasmine.any(Function));
        expect(spy).toHaveBeenCalled();
    });
});
