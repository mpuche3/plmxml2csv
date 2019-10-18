function addQty(arr, id) {
    const arrStr = arr.map(part => part[id]);
    const setStr = [...new Set(arrStr)];
    let children = [];
    for (const str of setStr) {
        let partUnique = {};
        let qty = 0;
        for (const part of arr) {
            if (str === part[id]) {
                qty += 1;
                partUnique = part;
            }
        }
        children.push({
            qty: qty,
            part: partUnique
        });
    }
    return children;
}

function run(xml) {
    const input = xml2json(parseXml(xml));
    const productInstance = input.PLMXML.ProductDef.InstanceGraph.ProductInstance
    const productRevisionView = input.PLMXML.ProductDef.InstanceGraph.ProductRevisionView

    prodInsObj = {};
    prodIns = productInstance.map(x => {
        return {
            id: x["@id"],
            name: x["@name"],
            partRef: x["@partRef"]
        }
    }).map(x => {
        prodInsObj[x.id] = x;
        return x;
    });

    prodRevViewObj = {};
    prodRevView = productRevisionView.map(x => {
        return {
            id: x["@id"],
            name: x["@name"],
            children: x["@instanceRefs"]
        }
    }).map(x => {
        if (x.children !== undefined)
            x.children = x.children.trim().split(" ");
        return x;
    }).map(x => {
        if (x.children !== undefined)
            x.children = x.children.map(id => prodInsObj[id]);
        return x;
    }).map(x => {
        prodRevViewObj["#" + x.id] = x;
        return x;
    }).map(x => {
        if (x.children !== undefined)
            x.children = x.children.map(obj => prodRevViewObj[obj.partRef]);
        return x;
    }).map(x => {
        if (x.children !== undefined)
            x.children = x.children.sort((a, b) => a.name.localeCompare(b.name));
        return x;
    }).map(x => {
        if (x.children !== undefined)
            x.children = addQty(x.children, "id");
        return x;
    }).sort((a, b) => a.name.localeCompare(b.name));

    topNode = prodRevViewObj['#' + productRevisionView[0]['@id']];
    return topNode;
}

function printOutPartRec(part, arrOutput = []) {
    if (part.children === undefined || part.children.length === 0) return;
    arrOutput.push('');
    arrOutput.push(`### ${part.name}`);
    for (let child of part.children) {
        arrOutput.push(`>>> ${child.part.name}, qty: ${child.qty}`);
    }
    for (let child of part.children) {
        printOutPartRec(child.part, arrOutput);
    }
    return arrOutput.join('\n');
}

function printOutPartOrdered(topNode) {
    let level = 0;
    let bucket = []
    bucket[0] = [topNode];
    let strOutput = '';
    while (bucket[level] !== undefined && bucket[level].length !== 0) {
        bucket[level + 1] = [];
        for (let part of bucket[level]) {
            if (part.children !== undefined) {
                strOutput += '\n';
                strOutput += `### ${part.name}\n`;
                for (let child of part.children) {
                    strOutput += `>>> ${child.part.name}, qty: ${child.qty}\n`;
                }
                for (let child of part.children) {
                    bucket[level + 1].push(child.part);
                }
            }
        }
        level +=1;
    }
    return strOutput;
}

document.querySelector("#button").onclick = event => {
    const xml = document.querySelector('#inputText').value;
    const topNode = run(xml);
    const strOutput = printOutPartOrdered(topNode);
    console.log(topNode);
    document.querySelector("#outputText").value = strOutput;
}