import Ethers from 'ethers'

export default class EtherTokenERC20 {
  _contract: null
  _wallet: null

  constructor(wallet) {
    this._wallet = wallet
    this.abi = `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_holder","type":"address"}],"name":"migrateBalance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"targetSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_holders","type":"address[]"}],"name":"migrateBalances","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"legacyRepContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_legacyRepContract","type":"address"},{"name":"_amountUsedToFreeze","type":"uint256"},{"name":"_accountToSendFrozenRepTo","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"holder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Migrated","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]`
  }

  getContract(contractAddress) {
    if (!this._contract) {
      this._contract = new Ethers.Contract(contractAddress, this.abi, this._wallet.etherWallet)
    }
    return this._contract
  }

  async getBalance(address, contractAddress) {
    const contract = this.getContract(contractAddress)
    let balance = await contract['balanceOf'](address)
    let decimals = await contract['decimals']()
    decimals = decimals.toNumber()
    balance = Ethers.utils.fromWei(balance.toString(), decimals)
    return balance
  }

  /**
   * @param {string} to 收款地址
   * @param {string} value 发送数量, 通过token.decimals转换为基于Wei的字符串
   * @param {string=null} contractAddress 合约地址, 非空时表示该交易为合约交易
   * @param {Object} opts
   * @param {string=100} opts.gasPrice 自定义gasPrice, 单位GWei
   * @param {number=null} opts.gasLimit 自定义gasLimit, 数字类型
   * @param {number=null} opts.nonce 自定义nonce, 数字类型
   */
  async send(to, value, contractAddress, opts = {}) {
    const contract = this.getContract(contractAddress)
    let {gasPrice = `100`, gasLimit = 80000, nonce = 0} = opts
    if (gasPrice) gasPrice = Ethers.utils.toWei(gasPrice, 'gwei')

    let decimals = await contract['decimals']()
    decimals = decimals.toNumber()
    value = Ethers.utils.toWei(value, decimals)

    const tx = await contract['transfer'](to, value, {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce || 0,
    })
    if (!tx || !tx.hash)
      throw new Error(`send ETH fail`)
    return tx.hash
  }
}
