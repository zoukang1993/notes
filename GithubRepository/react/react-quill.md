## react-quill

### https://github.com/zenoamaro/react-quill

> react 富文本编辑器，不适配移动浏览器

```
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

this.state = {
    editorState: EditorState.createEmpty(),
};

this.modules = {
    toolbar: [
        ['bold', 'underline'],
        [{ align: ''}, {align: 'center'}, {align: 'right'}],
        ['link', 'image'],
        ['clean'],
    ],
};

this.formats = [
    'bold', 'underline', 'blockquote',
    'align',
    'link', 'image', 'clean',
];

onEditorStateChange = (editorState) => {
    this.setState({
        editorState
    });
}


<ReactQuill
    theme="snow"
    modules={this.modules}
    formats={this.formats}
    defaultValue={this.state.value}
    placeholder="正文"
    value={this.state.editorState}
    onChange={this.onEditorStateChange}
    bounds={".quill"}
/>

```

