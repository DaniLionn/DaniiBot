const { EmbedBuilder } = require('discord.js');

module.exports({

    buildEmbed(colour, title, URL, author, description, thumbnail, fields, image, footer, addTimestamp) {

        const NewEmbed = new EmbedBuilder()

        if (colour) {
            NewEmbed.setColor(colour)
        } else {
            NewEmbed.setColor(0xFFFFFF)
        }

        if (title) {
            NewEmbed.setTitle(title)
        }

        if (URL) {
            NewEmbed.setURL(URL)
        }

        if (author) {
            NewEmbed.setAuthor(author)
        }

        if (description) {
            NewEmbed.setDescription(description)
        }

        if (thumbnail) {
            NewEmbed.setThumbnail(thumbnail)
        }

        if (fields) {
            NewEmbed.setFields(fields)
        }

        if (image) {
            NewEmbed.setImage(image)
        }

        if (footer) {
            NewEmbed.setFooter(footer)
        }

        if (addTimestamp === true) {
            NewEmbed.setTimestamp()
        }

    }

})
