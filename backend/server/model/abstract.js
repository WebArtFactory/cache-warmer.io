module.exports = {
    /**
     * Init. function
     *
     * @return void
     */
    init: function (child) {
        this.log('Astract Model Initialized.', child);
    },

    /**
     * Log if enable
     *
     * @param msg string
     */
    log: function (msg, child) {
        if (child.debugLogs) {
            console.log(msg);
        }
    }
};
