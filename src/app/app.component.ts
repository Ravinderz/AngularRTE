import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  sanitizer: any;
  content: string = "";
  selection: any;
  textAlignment = "";
  textAlignProp = "text-align:"

  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  ngOnInit(): void {
    this.content = "<div>This is the test content</div><div>test another</div><div>test</div><div>another</div><div>test another list</div>";
    this.getSelection();
  }

  title = 'rte-angular';

  getSelection() {
    document.getElementById("toolbar-container")!.onmouseenter = () => {
      if (window.getSelection) {
        this.selection = window.getSelection();
      } else if (document.getSelection) {
        this.selection = document.getSelection();
      }
    }
  }

  transformText(action: string) {

    let el: any = document.getElementById("text-content");

    console.log(this.selection)

    // instead of replace using slice
    if (this.selection) {
      if (action === 'BOLD') {
        this.content = el.innerHTML.replace(this.selection, `<strong>${this.selection}</strong>`)
      } else if (action === 'ITALIC') {
        this.content = el.innerHTML.replace(this.selection, `<i>${this.selection}</i>`)
      } else if (action === 'UNDERLINE') {
        this.content = el.innerHTML.replace(this.selection, `<u>${this.selection}</u>`)
      }

      if (action === 'LEFT_ALIGN') {
        if (el.innerHTML.includes(this.textAlignProp)) {
          this.content = el.innerHTML.replaceAll(this.textAlignProp + this.textAlignment, this.textAlignProp + "left");
        } else {
          this.content = el.innerHTML.replace(el.innerHTML, `<span style="text-align:left">${el.innerHTML}</span>`)
        }
        this.textAlignment = "left";
      } else if (action === 'CENTER_ALIGN') {
        if (el.innerHTML.includes(this.textAlignProp)) {
          this.content = el.innerHTML.replaceAll(this.textAlignProp + this.textAlignment, this.textAlignProp + "center");
        } else {
          this.content = el.innerHTML.replace(el.innerHTML, `<span style="text-align:center">${el.innerHTML}</span>`)
        }
        this.textAlignment = "center";
      } else if (action === 'RIGHT_ALIGN') {
        if (el.innerHTML.includes(this.textAlignProp)) {
          this.content = el.innerHTML.replaceAll(this.textAlignProp + this.textAlignment, this.textAlignProp + "right");
        } else {
          this.content = el.innerHTML.replace(el.innerHTML, `<span style="text-align:right">${el.innerHTML}</span>`)
        }
        this.textAlignment = "right";
      }

      if (action === "UNORDERED_LIST") {
        let frag = this.selection.getRangeAt(0).cloneContents();
        const htmlFragContent: any = [].map.call(frag.childNodes, (x: any) => x.outerHTML).join('')
        let newContent = htmlFragContent;
        newContent = newContent.replaceAll("<div>", "<li><div>");
        newContent = newContent.replaceAll("</div>", "</div></li>")
        this.content = el.innerHTML.replace(htmlFragContent, `<ul>${newContent}</ul>`)
      } else if (action === "ORDERED_LIST") {
        let frag = this.selection.getRangeAt(0).cloneContents();
        const htmlFragContent: any = [].map.call(frag.childNodes, (x: any) => x.outerHTML).join('')
        let newContent = htmlFragContent;
        newContent = newContent.replaceAll("<div>", "<li><div>");
        newContent = newContent.replaceAll("</div>", "</div></li>")
        this.content = el.innerHTML.replace(htmlFragContent, `<ol>${newContent}</ol>`)
      }

    }

    this.content = this.sanitizer.bypassSecurityTrustHtml(this.content);
    console.log(this.content);
  }

}
