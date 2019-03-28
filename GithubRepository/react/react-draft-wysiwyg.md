## react-draft-wysiwyg

> react rich text

### https://github.com/jpuri/react-draft-wysiwyg/issues/697

```
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

this.state = {
    editorState: EditorState.createEmpty(),
};


<Editor
    editorState={editorState}
    wrapperClassName="demo-wrapper"
    editorClassName="demo-editor"
    onEditorStateChange={this.onEditorStateChange}
    handlePastedText={() => false}
    toolbar={{
        options: ["inline", "image", "link","textAlign"],
        inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'underline'],
        },
        textAlign: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['left', 'center', 'right',],
        },
        link: {
            inDropdown: false,
            className: undefined,
            popupClassName: "link-customer-pop",
            showOpenOptionOnHover: false,
            defaultTargetOption: '_self',
            options: ['link'],
            linkCallback: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        image: {
            component: undefined,
            className: "zk-image",
            popupClassName: "image-customer-pop",
            urlEnabled: false,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: this.uploadImageCallBack,
            previewImage: true,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: false, mandatory: false },
            defaultSize: {
                height: '200',
                width: '200',
            },
        }
    }}
/>
```


### editorState hava data

```
let content = '<h1>I am html data</h1>';

const contentBlock = htmlToDraft(content);
const contentState = ContentState.createFromBlockArra(contentBlock.contentBlocks;
const editorState = EditorState.createWithContent(contentState);

this.setState({
    editorState,
});
```
