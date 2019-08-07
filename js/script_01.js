document.querySelector('#inputText').addEventListener('drop', e => {
    e.preventDefault();
    document.querySelector('#inputText').classList.remove("highlightedLine");
    if (e.dataTransfer.items) {
        let f = e.dataTransfer.files[0];
        let r = new FileReader();
        r.onload = e => {
            inputText.value = e.target.result;
            document.querySelector("#button").click();
        }
        r.readAsText(f);
    } else {
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
            fichero = file;
        }
    }
    
}, false);

document.querySelector('#inputText').addEventListener('dragenter', e => {
    e.preventDefault();
    console.log('File(s) entered drop zone');
    document.querySelector("#inputText").classList.add("highlightedLine");
}, false);

document.querySelector('#inputText').addEventListener('dragleave', e => {
    e.preventDefault();
    console.log('File(s) left drop zone');
    document.querySelector("#inputText").classList.remove("highlightedLine");
}, false);

document.querySelector('.kc_fab_main_btn').addEventListener('click', e => {
    const bool = document.querySelector('.message-container').classList.toggle("message-container-on");
    setTimeout(_=>document.querySelector('.message').classList.add("message-on"), 400);
    document.querySelector('.kc_fab_main_btn').classList.toggle("kc_fab_main_btn-message-on");
}, false);

document.querySelector('#close').addEventListener('click', e => {
    const bool = document.querySelector('.message-container').classList.toggle("message-container-on");
    document.querySelector('.message').classList.remove("message-on");
    setTimeout(_=>document.querySelector('.kc_fab_main_btn').classList.toggle("kc_fab_main_btn-message-on"), 400);
}, false);
