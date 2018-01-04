const assert = chai.assert;
const expect = chai.expect;

describe('appendHtml', function() {

  let container;

  window.globalTestSpy = chai.spy();

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

  it('should insert plain text', function () {
    const html = 'Foo Bar';
    appendHtml(html, container);
    assert.equal(container.innerHTML, html);
  });

  it('should insert html', function () {
    const html = '<p>Foo</p>Bar<p>Baz</p>';
    appendHtml(html, container);
    assert.equal(container.childNodes.length, 3);
    assert.equal(container.childNodes[0].outerHTML, '<p>Foo</p>');
    assert.equal(container.childNodes[1].nodeType, Node.TEXT_NODE);
    assert.equal(container.childNodes[1].data, 'Bar');
    assert.equal(container.childNodes[2].outerHTML, '<p>Baz</p>');
  });

  it('should insert a single script node', function (done) {
    const html = '<script>(function() { const foo = \'bar\'; })();</script>';
    appendHtml(html, container).then(function () {
      assert.equal(container.childNodes.length, 1);
      assert.equal(container.childNodes[0].outerHTML, html);
      done();
    });
  });

  it('should insert text, html and script nodes altogether', function (done) {
    const html = '<p>Foo</p>Bar<p>Baz</p><script>(function() { const foo = \'bar\'; })();</script>';
    appendHtml(html, container).then(function () {
      assert.equal(container.childNodes.length, 4);
      assert.equal(container.childNodes[0].outerHTML, '<p>Foo</p>');
      assert.equal(container.childNodes[1].nodeType, Node.TEXT_NODE);
      assert.equal(container.childNodes[1].data, 'Bar');
      assert.equal(container.childNodes[2].outerHTML, '<p>Baz</p>');
      assert.equal(container.childNodes[3].outerHTML, '<script>(function() { const foo = \'bar\'; })();</script>');
      done();
    });
  });

  it('should execute a script node with a src attribute', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./callGlobalTestSpy.js"></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called();
      done();
    });
  });

  it('should execute a script node with script contents', function (done) {
    window.globalTestSpy.reset();
    const html = '<script>window.globalTestSpy();</script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called();
      done();
    });
  });

  it('should execute multiple script nodes with a src attribute', function () {
  });

  it('should execute multiple script nodes with script contents', function () {
  });

  it('should execute mixed script nodes', function () {
  });

  it('should execute mixed script nodes and html', function () {
  });

  it('should immediately resolve promise for async nodes', function () {
  });

  it('should not immediately resolve promise for non-async nodes', function () {
  });

  it('should execute sync nodes and insert html in order', function () {
  });

  it('should execute async nodes and insert html in order', function () {
  });

});