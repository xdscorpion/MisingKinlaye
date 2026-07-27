/* Genealogy data for Kepang Érang. */

window.MISING_GENEALOGY_KEPANG = MisingGenealogy.chain(
    [
        ["Do:ni (Tani)", "root"], "Nibo", "Bomi", "Midong", "Dolo",
        "Lonung (Padam Sub-group)", "Nuda", "Dayi", "Yike",
        ["Kepang", "highlighted"]
    ],
    {
        label: "Papér", children: [
            {
                label: "Pértín", class: "final", children: [
                    MisingGenealogy.chain(["Tínrang"], { label: "Ra:tan", class: "final" }),
                    { label: "Tínling (Borang Clan)", class: "final" }
                ]
            },
            { label: "Pérme", class: "final" }
        ]
    }
);
