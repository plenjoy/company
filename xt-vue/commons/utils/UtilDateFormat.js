module.exports = {
  formatDate: function(date) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  },

  formatTime: function(date) {
    var d = new Date(date);
    var hours = String(d.getHours());
    var minutes = String(d.getMinutes());
    var seconds = String(d.getSeconds());

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    return [hours, minutes, seconds].join(':');
  },

  formatDateTime: function(date) {
    if (!date) return '';
    return this.formatDate(date) + " " + this.formatTime(date);
  }
}
