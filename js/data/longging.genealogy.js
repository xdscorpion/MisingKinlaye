/* Genealogy data for Longgíng Opín. */

window.MISING_GENEALOGY_LONGGING = MisingGenealogy.chain(
    [
        ["Do:ni (Tani)", "root"], "Nibo", "Bogo", "Godang", "Da:no", "Nokong",
        "Ko:bo", "Bolong", "Lo:yi", "Yidong", "Do:lo", "Lokung", "Kumíng", "Milong"
    ],
    {
        label: "Longgíng", class: "highlighted", children: [
            MisingGenealogy.chain(["Gipang"], { label: "Panggíng", class: "final" }),
            MisingGenealogy.chain(["Gila"], { label: "Lagasu:", class: "final" }),
            MisingGenealogy.chain(["Gino"], {
                label: "Noro", class: "final", children: [
                    MisingGenealogy.chain(["Robo"], { label: "Boling Noro" }),
                    MisingGenealogy.chain(["Rada"], {
                        label: "Dangga", children: [
                            MisingGenealogy.chain(["Gaki", "Kipo"], { label: "Pogag", class: "final" }),
                            MisingGenealogy.chain(["Gasin"], { label: "Sinte", class: "final" })
                        ]
                    })
                ]
            })
        ]
    }
);
