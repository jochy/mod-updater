export default {
    isNewer: function(semver1, semver2) {
        return this._toLong(semver1) > this._toLong(semver2);
    },
    _toLong: function(semver) {
        let tab = semver.split('.');
        return tab[0] * 10000 + tab[1] * 100 + parseInt(tab[2]);
    }
}