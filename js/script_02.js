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


function run() {
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

    console.log(prodRevView);

    let strOutput = '';
    for (const part of prodRevView) {
        if (part.children !== undefined) {
            strOutput += '\n'
            strOutput += part.name + '\n'
            for (child of part.children) {
                strOutput += ">>> " + child.part.name + '|' + child.qty + '\n'
            }
        }
    }
    return strOutput;
}


document.querySelector("#button").onclick = event => {

    const xml = document.querySelector('#inputText').value;


    strOutput = run(xml);
    document.querySelector("#outputText").value = strOutput;
}