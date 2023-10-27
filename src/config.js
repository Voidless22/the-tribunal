module.exports = {
    client: {
        token: '[your bot token here]',
        id: '[your bot id here]'
    },
    handler: {
        prefix: '?',
        deploy: true,
        commands: {
            prefix: true,
            slash: true,
            user: true,
            message: true
        },
    },
    guild: {
        id: '[your testing server id here]'
    },
    petitionCategories: [
        "IP Exemption",
        "Lost Item",
        "Lost Corpse",
        "Kill Stealing",
        "Ninja Looting",
        "Training",
        "Exploit",
        "Inappropriate Language",
        "Suspected Hacking",
        "Suspected Automation",
        "Suspected Multiboxing",
        "Camp Dispute",
        "Raid Dispute",
        "Guild Dispute",
        "Bug Report"
    ]
};