export const putPet = {
    rest: 'PUT',
    endpoint: '/pet',
    generateRequestBody: function () {
        return {
            id: 10,
            name: "doggie",
            category: {
                id: 1,
                name: "Dogs"
            },
            photoUrls: [
                "string"
            ],
            tags: [
                {
                    id: 0,
                    name: "string"
                }
            ],
            status: "available"
        };
    }
}