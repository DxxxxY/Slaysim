module.exports = {
    getLatestProfile: (profiles, uuid) => {
        let lastSaves = [],
            profilesArr = [],
            profileNames = []

        //go over each profileName, get the latest save and use the index of that to retrieve the profileName and the profileName
        Object.keys(profiles).forEach(profileName => {
            lastSaves.push(profiles[profileName].members[uuid].last_save)
            profilesArr.push(profiles[profileName])
            profileNames.push(profiles[profileName].cute_name)
        })

        return [profilesArr[lastSaves.indexOf(Math.max(...lastSaves))], profileNames[lastSaves.indexOf(Math.max(...lastSaves))]]
    },
    shuffle: (array) => {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }
}