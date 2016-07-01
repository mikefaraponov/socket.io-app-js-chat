'use strict';

const socket = io.connect('http://192.168.0.109:8000');

function addUser() {
	socket.emit('chat:adduser', prompt('Write your username!'));
}

function processMessage(username, data) {
	$(`<p class="b-message"><b>${username}:</b> ${sanitaze(data)}</p><br>`)
		.appendTo($('.b-messages-list'));
}

function updateUserList(data) {
	const userList = $('.b-users');
	userList.empty();
	$.each(data, key => userList.append(`<div class="b-users__user">${sanitaze(key)}</div>`));
}

function sendMessage() {
	var message = $('.js-message').val();
	$('.js-message').val('');
	socket.emit('chat:send', message);
	$('.js-message').focus();
}

function processEnterPress(ev) {
	if (ev.which == 13) {
		ev.preventDefault();
		$(this).blur();
		$('.js-send').focus().click();
	}
}

/**
 * toggleSidebar toggles sidebar menu with userlist
 */
function toggleSidebar() {
	$('.b-sidebar').toggleClass('b-sidebar--active');
	$('.b-blank').toggleClass('b-blank--active');
}

/**
 * sanitaze
 * @param input {String} user input
 * @retval {String} string sanitazed from evil XSS attacks
 */
function sanitaze(input) {
	return input
		.replace(/&/g, '&amp')
		.replace(/</g, '&lt')
		.replace(/>/g, '&gt')
		.replace(/"/g, '&quot')
		.replace(/'/g, '&#x27')
		.replace(/\//g, '&#x2F');
}

jQuery(document).ready(function() {
	socket.on('connect', addUser);
	socket.on('chat:update', processMessage);
	socket.on('chat:updateusers', updateUserList);
	$('.js-send').click(sendMessage);
	$('.js-message').keypress(processEnterPress);
	$('.b-sidebar__burger').click(toggleSidebar);
});