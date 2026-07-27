/* Genealogy data for Sinung Opín.
   The dotted link into Dodum marks a generation whose ancestor
   names have been lost or forgotten — see the on-page note. */

window.MISING_GENEALOGY_SINUNG = MisingGenealogy.chain(
    [["Do:ni (Tani)", "root"], "Nibo", "Bomi", "Mibo", ["Dodum", undefined, "dotted"], "Dumdé", "Dumpum", "Pu:si"],
    {
        label: "Sinung", class: "highlighted", children: [
            MisingGenealogy.chain(["Nu:tír", "Jo:tír"], { label: "Pa:tír", class: "final" }),
            {
                label: "Nusar", children: [
                    { label: "Pasar", class: "final" },
                    { label: "Pa:me", class: "final" }
                ]
            },
            {
                label: "Nupang", children: [
                    { label: "Pa:nyang", class: "final" },
                    { label: "Pa:dun", class: "final" }
                ]
            }
        ]
    }
);
