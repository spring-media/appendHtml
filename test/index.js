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
    const html = '<p>Foo</p>Bar<p>Baz</p><script>(function() { const foo = \'bar\'; })();</script><p>Bazinga</p>';
    appendHtml(html, container).then(function () {
      assert.equal(container.childNodes.length, 5);
      assert.equal(container.childNodes[0].outerHTML, '<p>Foo</p>');
      assert.equal(container.childNodes[1].nodeType, Node.TEXT_NODE);
      assert.equal(container.childNodes[1].data, 'Bar');
      assert.equal(container.childNodes[2].outerHTML, '<p>Baz</p>');
      assert.equal(container.childNodes[3].outerHTML, '<script>(function() { const foo = \'bar\'; })();</script>');
      assert.equal(container.childNodes[4].outerHTML, '<p>Bazinga</p>');
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

  it('should execute multiple script nodes with a src attribute', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./callGlobalTestSpy.js"></script><script src="./callGlobalTestSpy2.js"></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.exactly(2);
      done();
    });
  });

  it('should execute multiple script nodes with script contents', function (done) {
    window.globalTestSpy.reset();
    const html = '<script>window.globalTestSpy();</script><script>window.globalTestSpy();</script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.exactly(2);
      done();
    });
  });

  it('should execute mixed script nodes', function (done) {
    window.globalTestSpy.reset();
    const html = '<script>window.globalTestSpy();</script><script src="./callGlobalTestSpy.js"></script><script>window.globalTestSpy();</script><script src="./callGlobalTestSpy2.js"></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.exactly(4);
      done();
    });
  });

  it('should execute mixed script nodes and html', function (done) {
    window.globalTestSpy.reset();
    const html = '<p>Foo</p>Bar<script>window.globalTestSpy();</script><script src="./callGlobalTestSpy.js"></script><p>Baz</p><script>window.globalTestSpy();</script><p>Foobar</p><script src="./callGlobalTestSpy2.js"></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.exactly(4);
      done();
    });
  });

  it('should immediately resolve promise for async nodes', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./callGlobalTestSpy.js" async></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).not.to.have.been.called();
      done();
    });
  });

  it('should reject promise with invalid src in script tag', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./doesnotexist.js"></script>';
    const promise = appendHtml(html, container, 1000);
    promise.catch(function (err) {
      expect(window.globalTestSpy).to.not.have.been.called();
      done();
    });
  });

  it('should not immediately resolve promise for non-async nodes', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./callGlobalTestSpy.js"></script>';
    const promise = appendHtml(html, container);
    expect(window.globalTestSpy).not.to.have.been.called();
    promise.then(function () {
      expect(window.globalTestSpy).to.have.been.called();
      done();
    });
  });

  it('should execute inline script nodes before appending html', function (done) {
    window.globalTestSpy.reset();
    const html = '<script>(function() { const divs = document.querySelectorAll(\'.test-div\'); window.globalTestSpy(divs.length); })();</script><div class="test-div"></div>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(0);
      done();
    });
  });

  it('should execute inline script nodes after appending html', function (done) {
    window.globalTestSpy.reset();
    const html = '<div class="test-div"></div><script>(function() { const divs = document.querySelectorAll(\'.test-div\'); window.globalTestSpy(divs.length); })();</script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(1);
      done();
    });
  });

  it('should execute inline script nodes and append html in order', function (done) {
    window.globalTestSpy.reset();
    const html = [
      '<script>(function() { const divs = document.querySelectorAll(\'.test-div\'); window.globalTestSpy(divs.length); })();</script>',
      '<div class="test-div"></div>',
      '<script>(function() { const divs = document.querySelectorAll(\'.test-div\'); window.globalTestSpy(divs.length); })();</script>'
    ].join('');
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(0);
      expect(window.globalTestSpy).to.have.been.called.with(1);
      done();
    });
  });

  it('should execute sync nodes before appending html', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./countTestDiv.js"></script><div class="test-div"></div>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(0);
      done();
    });
  });

  it('should execute sync nodes after appending html', function (done) {
    window.globalTestSpy.reset();
    const html = '<div class="test-div"></div><script src="./countTestDiv.js"></script>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(1);
      done();
    });
  });

  it('should execute sync nodes and append html in order', function (done) {
    window.globalTestSpy.reset();
    const html = [
      '<script src="./countTestDiv.js"></script>',
      '<div class="test-div"></div>',
      '<script src="./countTestDiv.js"></script>'
    ].join('');
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).to.have.been.called.with(0);
      expect(window.globalTestSpy).to.have.been.called.with(1);
      done();
    });
  });


  it('should execute async nodes after appending html', function (done) {
    window.globalTestSpy.reset();
    const html = '<script src="./countTestDiv.js" async></script><div class="test-div"></div>';
    appendHtml(html, container).then(function () {
      expect(window.globalTestSpy).not.to.have.been.called();
      window.setTimeout(function () {
        expect(window.globalTestSpy).to.have.been.called.with(1);
        done();
      }, 20);
    });
  });

});