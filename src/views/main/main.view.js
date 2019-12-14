const path = require('path');
const prettyBytes = require('pretty-bytes');
const { remote } = require('electron');
const si = require('systeminformation');
const html2canvas = require('html2canvas');
const fs = require('fs');
let tableData = localTableDataLoad();
const renderPortion = document.getElementById('render-portion');


let html2canvasOptions = {
    dpi: 384,
    scale: 2,
}

let dataState = [];

let btnSaveImage = document.getElementById("btnSaveImage");
let btnSaveTxt = document.getElementById("btnSaveTxt");
let btnRefresh = document.getElementById("btnRefresh");


document.getElementById("btnCloser").addEventListener("click", close);
btnRefresh.addEventListener("click", refreshData);
btnSaveImage.addEventListener("click", saveAsImage);
btnSaveTxt.addEventListener("click", saveAsTxt);

getSysInfo();

function localTableDataLoad() {
    return JSON.parse(fs.readFileSync(path.resolve('src/data/components.json'), 'utf8'));
}
function localTableDataSave() {
    if (dataState.length === tableData.length) {
        btnRefresh.removeAttribute('disabled');
        fs.writeFileSync(path.resolve('src/data/components.json'), JSON.stringify(tableData));
        dataState = [];
    }
}

function close() {
    remote.getCurrentWindow().close();
}

function getSysInfo() {
    btnRefresh.setAttribute('disabled', true);
    setCPU(si.cpu);
    setGPU(si.graphics);
    setRAM(si.memLayout);
    setDisk(si.diskLayout);
    setMotherboard(si.baseboard);
    renderTable();
}

function refreshData() {
    tableData = [
        {
            title: "CPU",
            content: []
        },
        {
            title: "GPU",
            content: []
        },
        {
            title: "RAM",
            content: []
        },
        {
            title: "DISK",
            content: []
        },
        {
            title: "MOTHERBOARD",
            content: []
        }
    ]
    getSysInfo();
}

function updateState() {
    dataState.push(true);
    localTableDataSave();
}

function setTableContent(contentID, data) {
    let index = tableData.findIndex(p => p.title == contentID);
    tableData[index].content = data;
    renderTable();
}

async function setCPU(fcpu) {
    let cpu = await fcpu();
    setTableContent('CPU', [`${cpu.manufacturer} ${cpu.brand}`]);
    updateState();
}

async function setGPU(fgpu) {
    let gpu = await fgpu();
    let gcards = [];
    gpu.controllers.forEach(e => {
        gcards.push(e.model);
    });
    setTableContent('GPU', gcards);
    updateState();
}

async function setRAM(fram) {
    let ram = await fram();
    let rams = [];
    ram.forEach(e => {
        rams.push(`${prettyBytes(e.size)} ${e.clockSpeed} MHz ${e.manufacturer}`);
    });
    setTableContent('RAM', rams);
    updateState();
}

async function setDisk(fdisk) {
    let disk = await fdisk();
    let disks = [];
    disk.forEach(e => {
        disks.push(`${prettyBytes(e.size)} ${e.type} Disk - ${e.interfaceType} ${e.name}`);
    })
    setTableContent('DISK', disks);
    updateState();
}

async function setMotherboard(fmb) {
    let mb = await fmb();
    setTableContent('MOTHERBOARD', [`${mb.manufacturer} - ${mb.model}`]);
    updateState()
}


function renderTable() {
    let tbody = document.getElementById('table-body');

    // Clean table
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Populate table
    tableData.forEach(e => {
        let tr = document.createElement('tr');
        let tdtitle = document.createElement('td');
        let tdcontent = document.createElement('td');
        tdtitle.className = 'uk-text-small uk-text-bold';
        tdcontent.className = 'uk-text-small';
        tdtitle.textContent = e.title;
        if (e.content.length > 1) {
            let ulcontent = document.createElement('ul');
            tdcontent.className += ' uk-padding-remove-right';
            ulcontent.className = 'uk-list uk-list-divider';
            e.content.forEach(c => {
                let licontent = document.createElement('li');
                licontent.textContent = c;
                ulcontent.appendChild(licontent)
            })
            tdcontent.appendChild(ulcontent);
        } else if (e.content.length == 0) {
            let loading = document.createElement('div');
            let loadingText = document.createElement('div');
            let loadingSpinner = document.createElement('div');
            loading.className = 'uk-flex'
            loadingText.textContent = 'Fetching info...';
            loadingText.className = 'uk-margin-small-left'
            loadingSpinner.setAttribute('uk-spinner', 'ratio: 0.6');
            loading.append(loadingSpinner, loadingText);
            tdcontent.appendChild(loading);
        } else {
            tdcontent.textContent = e.content[0];
        }
        tr.append(tdtitle, tdcontent);
        tbody.appendChild(tr);
    });
}


async function saveAsImage() {
    try {
        btnSaveImage.setAttribute('disabled', true);
        let canvasHeightOption = { height: renderPortion.clientHeight };
        window.scrollTo(0, 0);
        let canvas = await html2canvas(renderPortion, {
            ...html2canvasOptions,
            ...canvasHeightOption
        });
        let imgBuffer = decodeBase64Image(canvas.toDataURL('image/png'));
        let saveDir = await remote.dialog.showSaveDialog({
            defaultPath: `MY_SYSTEM_INFORMATION_${Date.now()}`,
            filters: [{
                name: 'Image',
                extensions: ['png']
            }]
        });
        fs.writeFileSync(saveDir.filePath, imgBuffer.data);
    } catch (error) {
        console.log(error);
    } finally {
        btnSaveImage.removeAttribute('disabled');
    }
}

async function saveAsTxt() {

    try {
        btnSaveTxt.setAttribute('disabled', true);
        let text = 'MY SYSTEM INFORMATION\nWebsite: https://msi.jecsham.com\n\n'

        tableData.forEach(e => {
            text += e.title + '\n';
            e.content.forEach(c => {
                text += c + '\n';
            });
            text += '\n'
        });

        let saveDir = await remote.dialog.showSaveDialog({
            defaultPath: `MY_SYSTEM_INFORMATION_${Date.now()}`,
            filters: [{
                name: 'Text',
                extensions: ['txt']
            }]
        });
        fs.writeFileSync(saveDir.filePath, text);
    } catch (error) {
        console.log(error);
    } finally {
        btnSaveTxt.removeAttribute('disabled');
    }

}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}