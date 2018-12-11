import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  
  private mutationObserver;
  private messageBox;
  
  constructor() { }

  @Input() messages;
  
  ngOnInit() {
    this.messageBox = document.getElementById("message-box");
    this.mutationObserver = new MutationObserver(() => {
      this.messageBox.scrollTop = this.messageBox.scrollHeight - this.messageBox.clientHeight;
    });
    this.mutationObserver.observe(this.messageBox, { attributes: false, childList: true, subtree: false });    
  }

}
