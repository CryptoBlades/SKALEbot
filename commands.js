module.exports = {
    roles: function()
    {
        const roles = ['955127683409391720']
        return roles;
    },
    allowed: function(arrA, arrB)
    {
        let intersection = arrA.filter(x => arrB.includes(x));
        return intersection;
    }
}