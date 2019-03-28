## react-cropper

### https://github.com/roadmanfong/react-cropper


> react 图片剪裁

```
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';



<Cropper
    style={{ height: 300, width: '100%' }}
    aspectRatio={16 / 9}
    preview=".img-preview"
    guides={false}
    src={this.state.src}
    ref={cropper => { this.cropper = cropper; }}
/>

// input file select image
selectSurfaceImg = (e) => {
    e.preventDefault();
    let files;

    if (e.dataTransfer) {
        files = e.dataTransfer.files;
    } else if (e.target) {
        files = e.target.files[0];
    } 

    const reader = new FileReader();
    reader.onload = () => {
        this.setState({
            src: reader.result,
            cropModal: true,
        });
    };

    reader.readAsDataURL(files);
}

cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
        return;
    }

    this.setState({
        cropResult: this.cropper.getCroppedCanvas().toDataURL(),
    }, () => {
        let file = this.dataURItoBlob(this.state.cropResult);
        this.uploadSurfaceImage(file);
    });

    this.onClose();
}

dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

onClose = () => {
    this.setState({
        cropModal: false,
        src: '',
    });
}

uploadSurfaceImage = async (file) => {
    let {key} = await this.uploadImage(file);

    if (!key) {
        return;
    }

    this.setState({
        surfaceImage: 'https://file-star.kuipmake.com/' + key,
    });
}

removeSurfaceImage = () => {
    this.setState({
        surfaceImage: '',
    });
}

```
