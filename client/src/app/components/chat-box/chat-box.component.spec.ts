import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
  let component: ChatBoxComponent;
  let fixture: ComponentFixture<ChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display chat messages', () => {
    component.messages = [      { text: 'Hello', roomId: '123', isSender: true, isSystem: false, name: 'John' },      { text: 'Hi there!', roomId: '123', isSender: false, isSystem: false, name: 'Jane' }    ];
    fixture.detectChanges();
    const messageElements = fixture.nativeElement.querySelectorAll('.message');
    expect(messageElements.length).toEqual(2);
    expect(messageElements[0].textContent).toContain('John');
    expect(messageElements[0].textContent).toContain('Hello');
    expect(messageElements[1].textContent).toContain('Jane');
    expect(messageElements[1].textContent).toContain('Hi there!');
  });

  it('should add a new message when the "Add" button is clicked', () => {
    const addButton = fixture.nativeElement.querySelector('.add-button');
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'Hello';
    inputElement.dispatchEvent(new Event('input'));
    addButton.dispatchEvent(new Event('click'));
    expect(component.messages.length).toEqual(1);
    expect(component.messages[0].text).toEqual('Hello');
  });

  it('should add a new message when the "Enter" key is pressed', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'Hello';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.messages.length).toEqual(1);
    expect(component.messages[0].text).toEqual('Hello');
  });

  it('should clear the input field when a message is added', () => {
    const addButton = fixture.nativeElement.querySelector('.add-button');
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'Hello';
    inputElement.dispatchEvent(new Event('input'));
    addButton.dispatchEvent(new Event('click'));
    expect(inputElement.value).toEqual('');
  });
});
