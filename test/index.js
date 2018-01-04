const assert = chai.assert;

describe('appendHtml', function() {

  let container;

  beforeEach(function () {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
  });

  it('appendHtml should be defined', function () {
    assert.equal(typeof appendHtml, 'function');
  });

  it('should insert plain text', function() {
    const plainText = 'Foo Bar';
    appendHtml(plainText, container);
    assert.equal(container.innerHTML, plainText);
  });

});