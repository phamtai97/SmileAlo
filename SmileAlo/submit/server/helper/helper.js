const githubUsernNameRegex = require('github-username-regex');

const isUserNameAndPassword = (string) => {
    return githubUsernNameRegex.test(string);
}

const isImage = (url) => {
    regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
    return regex.test(url);
}

module.exports = {
    isUserNameAndPassword,
    isImage,
}
