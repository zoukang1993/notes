###　upload file to qiniu with ajax
```
uploadImage = async (file) => {
    const uptoken = await getTokenFromServer();

    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://up.qbox.me/');

            const data = new FormData();
            data.append('file', file);
            data.append('token', uptoken);
            xhr.send(data);

            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            }, {passive: false});

            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            }, {passive: false});
        }
    );
}

```