import { options, createElement, render, Component } from 'preact';
import { teardown, setupRerender } from 'preact/test-utils';

/** @jsx createElement */

describe('setupRerender & teardown', () => {
	/** @type {HTMLDivElement} */
	let scratch;

	beforeEach(() => {
		scratch = document.createElement('div');
	});

	it('should restore previous debounce', () => {
		let spy = (options.debounceRendering = sinon.spy());

		setupRerender();
		teardown();

		expect(options.debounceRendering).to.equal(spy);
	});

	it('should flush the queue', () => {
		/** @type {() => void} */
		let increment;
		class Counter extends Component {
			constructor(props) {
				super(props);

				this.state = { count: 0 };
				increment = () => this.setState({ count: this.state.count + 1 });
			}

			render() {
				return <div>{this.state.count}</div>;
			}
		}

		// Setup rerender
		setupRerender();

		// Initial render
		render(<Counter />, scratch);
		expect(scratch.innerHTML).to.equal('<div>0</div>');

		// queue rerender
		increment();
		expect(scratch.innerHTML).to.equal('<div>0</div>');

		// Pretend test forgot to call rerender. Teardown should effectively do that
		teardown();
		expect(scratch.innerHTML).to.equal('<div>1</div>');
	});
});
