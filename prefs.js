
const electron = require('electron');

function setup_with_prefs(prefs)
{
    var sel, optel;

    sel = $('#sel-color-theme');
    sel.prop('disabled', false);
    sel.empty();

    optel = $('<option>', { value:'light' }).text('Light');
    if (prefs.gamewin_colortheme == 'light')
        optel.prop('selected', true);
    sel.append(optel);
    optel = $('<option>', { value:'dark' }).text('Dark');
    if (prefs.gamewin_colortheme == 'dark')
        optel.prop('selected', true);
    sel.append(optel);

    sel.on('change', evhan_color_theme);
    apply_color_theme(prefs.gamewin_colortheme);


    sel = $('#sel-font');
    sel.prop('disabled', false);
    sel.empty();

    for (var ix=0; ix<fontlist.length; ix++) {
        var font = fontlist[ix];
        optel = $('<option>', { value:font.key }).text(font.label);
        if (prefs.gamewin_font == font.key)
            optel.prop('selected', true);
        sel.append(optel);
    }

    sel.on('change', evhan_font);
    apply_font(prefs.gamewin_font);


    sel = $('#range-margin');
    sel.attr('step', 1);
    sel.attr('min', 0);
    sel.attr('max', 5);

    sel.on('change', evhan_margin_level);
    sel.val(prefs.gamewin_marginlevel);
    apply_margin_level(prefs.gamewin_marginlevel);
}

function apply_color_theme(val)
{
    var bodyel = $('.Sample');

    if (val == 'dark') {
        if (!bodyel.hasClass('DarkTheme'))
            bodyel.addClass('DarkTheme');
    }
    else {
        bodyel.removeClass('DarkTheme');
    }
}

var fontlist = [
    { key:'lora', label:'Lora' },
    { key:'georgia', label:'Georgia' },
    { key:'helvetica', label:'Helvetica' },
    { key:'gentium', label:'Gentium Book' },
    { key:'baskerville', label:'Libre Baskerville' }
];

function apply_font(val)
{
    var fontline = null;

    switch (val) {
    case 'georgia':
        fontline = 'Georgia, Cambria, serif';
        break;
    case 'helvetica':
        fontline = '"Helvetica Neue", Helvetica, Arial, sans-serif';
        break;
    case 'gentium':
        fontline = '"Gentium Book Basic", Georgia, Cambria, serif';
        break;
    case 'baskerville':
        fontline = '"Libre Baskerville", Palatino, Georgia, serif';
        break;
    case 'lora':
    default:
        fontline = null;
        break;
    }

    var el = $('#fontcss');
    if (!fontline) {
        el.remove();
    }
    else {
        if (!el.length) {
            el = $('<style>', { id:'fontcss', type:'text/css' });
            $('#bodycss').before(el);
        }
        var text = '.Sample { font-family: @@; }\n';
        text = text.replace(/@@/g, fontline);
        el.text(text);
    }
}

function apply_margin_level(val)
{
    var str = '0px ' + (5*val) + '%';
    $('.SampleText').css({'margin':str});

    var el = $('#display-margin');
    var text = 'None';
    if (val > 0)
        text = (val*5) + '%';
    el.text(text);
}

function evhan_color_theme()
{
    var sel = $('#sel-color-theme');
    var val = sel.val();
    apply_color_theme(val);
    electron.ipcRenderer.send('pref_color_theme', val);
}

function evhan_font()
{
    var sel = $('#sel-font');
    var val = sel.val();
    apply_font(val);
    electron.ipcRenderer.send('pref_font', val);
}

function evhan_margin_level()
{
    var sel = $('#range-margin');
    var val = sel.val();
    apply_margin_level(val);
    electron.ipcRenderer.send('pref_margin_level', val);
}

electron.ipcRenderer.on('current-prefs', function(ev, arg) {
    setup_with_prefs(arg);
});
