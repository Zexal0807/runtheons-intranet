const { generateKeyPair } = require('crypto');
class IntranetManager {



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

}

module.exports = new IntranetManager();