const NodeRSA = require('node-rsa');
const { generateKeyPair } = require('crypto');
const axios = require('axios');

class IntranetManager {

	option = {
		host: "https://api.runtheons.com",
		url: "/intranet/login",
		method: "PUT"
	};

	async requestToken(serverName, option) {
		Object.assign(this.option, option);
		return new Promise((resolve, reject) => {
			try {
				const keys = await this._generateKeyPair();

				const encryptToken = await this._sendRequest({
					server: serverName,
					key: keys.publicKey
				})

				const privateKey = new NodeRSA(keys.privateKey);

				const token = privateKey.decrypt(encryptToken, 'utf8');

				return resolve(token);
			} catch (e) {
				return reject(e);
			}
		});
	}

	async _generateKeyPair() {
		return new Promise((resolve, reject) => {
			generateKeyPair('rsa', {
				modulusLength: 4096,
				publicKeyEncoding: {
					type: 'spki',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs8',
					format: 'pem'
				}
			}, (err, publicKey, privateKey) => {
				if (err)
					return rejects(err)
				return resolve({
					publicKey: publicKey,
					privateKey: privateKey
				});
			});
		});
	}

	async _sendRequest({ key, server }) {
		return new Promise((resolve, reject) => {
			axios({
				method: this.option.method,
				url: this.option.host + this.option.url,
				data: {
					publicKey: key,
					server: server
				}
			}).then(response => {
				return resolve(response.data.token);
			}).catch(err => {
				return reject(response);
			});
		});
	}

	cryptPayload(payload, publicKey) {
		const key = new NodeRSA(publicKey);
		var encryptedPayload = key.encrypt(payload, 'base64');
		return encryptedPayload;
	}

}

module.exports = new IntranetManager();