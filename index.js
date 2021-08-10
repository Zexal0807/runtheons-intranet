const NodeRSA = require('node-rsa');
const { generateKeyPair } = require('crypto');
const axios = require('axios');

class IntranetManager {

	async requestToken(option) {
		return new Promise((resolve, reject) => {
			try {
				const keys = await this._generateKeyPair();

				const encryptToken = await this._sendRequest({
					host: option.host,
					key: keys.publicKey
				})

				const privateKey = new NodeRSA(keys.privateKey);

				const token = privateKey.decrypt(encryptToken);

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
					format: 'pem',
					cipher: 'aes-256-cbc',
					passphrase: 'top secret'
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

	_sendRequest({ host, url, method, key, server }) {
		return new Promise((resolve, reject) => {
			axios({
				method: method,
				url: host + url,
				data: {
					publicKey: key,
					server: server
				}
			}).then(response => {
				return resolve(response)
			}).catch(err => {
				return reject(response)
			})
		});
	}

}

module.exports = new IntranetManager();