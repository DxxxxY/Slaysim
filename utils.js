module.exports = {
    getLatestProfile: (profiles, uuid) => {
        let lastSaves = [],
            profilesArr = [],
            profileNames = []

        //go over each profileName, get the latest save and use the index of that to retrieve the profileName and the profileName
        Object.keys(profiles).forEach(profileName => {
            lastSaves.push(profiles[profileName].members[uuid].last_save)
            profilesArr.push(profiles[profileName])
            profileNames.push(profiles[profileName].cute_userName)
        })

        return [profilesArr[lastSaves.indexOf(Math.max(...lastSaves))], profileNames[lastSaves.indexOf(Math.max(...lastSaves))]]
    },
}