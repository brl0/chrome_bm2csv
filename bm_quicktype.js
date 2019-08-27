// Generate by https://quicktype.io

// To parse this data:
//
//   const Convert = require("./file");
//
//   const bmQt = Convert.toBmQt(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toBmQt(json) {
    return cast(json, r("BmQt"));
}

function bmQtToJson(value) {
    return JSON.stringify(uncast(value, r("BmQt")), null, 2);
}

function invalidValue(typ, val) {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val, typ, getProps) {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    return transformPrimitive(typ, val);
}

function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}

function a(typ) {
    return { arrayItems: typ };
}

function u(...typs) {
    return { unionMembers: typs };
}

function o(props, additional) {
    return { props, additional };
}

function m(additional) {
    return { props: [], additional };
}

function r(name) {
    return { ref: name };
}

const typeMap = {
    "BmQt": o([
        { json: "checksum", js: "checksum", typ: "" },
        { json: "roots", js: "roots", typ: r("Roots") },
        { json: "version", js: "version", typ: 0 },
    ], false),
    "Roots": o([
        { json: "bookmark_bar", js: "bookmark_bar", typ: r("BookmarkBar") },
        { json: "other", js: "other", typ: r("Other") },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "synced", js: "synced", typ: r("BookmarkBar") },
    ], false),
    "BookmarkBar": o([
        { json: "children", js: "children", typ: a(r("BookmarkBarChild")) },
        { json: "date_added", js: "date_added", typ: "" },
        { json: "date_modified", js: "date_modified", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "IndigoChild": o([
        { json: "date_added", js: "date_added", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "meta_info", js: "meta_info", typ: u(undefined, r("MetaInfo")) },
        { json: "children", js: "children", typ: u(undefined, a(r("BookmarkBarChild"))) },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
    ], false),
    "StickyChild": o([
        { json: "date_added", js: "date_added", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "children", js: "children", typ: u(undefined, a(r("IndigoChild"))) },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
        { json: "meta_info", js: "meta_info", typ: u(undefined, r("MetaInfo")) },
    ], false),
    "TentacledChild": o([
        { json: "date_added", js: "date_added", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "meta_info", js: "meta_info", typ: u(undefined, r("MetaInfo")) },
        { json: "children", js: "children", typ: u(undefined, a(r("StickyChild"))) },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
    ], false),
    "FluffyChild": o([
        { json: "children", js: "children", typ: u(undefined, a(r("TentacledChild"))) },
        { json: "date_added", js: "date_added", typ: "" },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "meta_info", js: "meta_info", typ: u(undefined, r("MetaInfo")) },
    ], false),
    "PurpleChild": o([
        { json: "children", js: "children", typ: u(undefined, a(r("FluffyChild"))) },
        { json: "date_added", js: "date_added", typ: "" },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "meta_info", js: "meta_info", typ: u(undefined, r("MetaInfo")) },
    ], false),
    "BookmarkBarChild": o([
        { json: "date_added", js: "date_added", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "children", js: "children", typ: u(undefined, a(r("PurpleChild"))) },
        { json: "date_modified", js: "date_modified", typ: u(undefined, "") },
    ], false),
    "MetaInfo": o([
        { json: "last_visited_desktop", js: "last_visited_desktop", typ: u(undefined, "") },
        { json: "last_visited", js: "last_visited", typ: u(undefined, "") },
    ], false),
    "Other": o([
        { json: "children", js: "children", typ: a(r("OtherChild")) },
        { json: "date_added", js: "date_added", typ: "" },
        { json: "date_modified", js: "date_modified", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "OtherChild": o([
        { json: "children", js: "children", typ: a(r("BookmarkBarChild")) },
        { json: "date_added", js: "date_added", typ: "" },
        { json: "date_modified", js: "date_modified", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "sync_transaction_version", js: "sync_transaction_version", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Type": [
        "folder",
        "url",
    ],
};

module.exports = {
    "bmQtToJson": bmQtToJson,
    "toBmQt": toBmQt,
};
