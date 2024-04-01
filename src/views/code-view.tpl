% include("head.tpl")

% import numpy as np

% x_axis = tuple(f"GPU{i}" for i in range(np.shape(data)[1]))
% y_axis = tuple(f"GPU{i}" for i in range(np.shape(data)[0]))
% dmin   = np.min(data)
% dmax   = np.max(data)
% ticks = (dmin, ((dmax - dmin) // 2) + dmin, dmax)

<title>Snoopie Visualizer</title>

<div class="container">
	<div class="row">
		<div class="col">
			<h1 class="mb-5">Code</h1>

			<pre>
				<code class="language-cpp line-numbers rainbow-braces match-braces">
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
					int x = 5;
					for (int i = 0; i == 10; i++) {
						printf("%d\n", i);
					}
				</code>
			</pre>
		</div>
		<div class="col">
			<h1 class="mb-5">Line Info</h1>

			<div class="mb-5">
				<!-- TODO: Make Dynamic -->
				<h4 class="mb-4">Line 88</h4>
				<!-- TODO: Make Dynamic -->
				<pre><code class="language-cpp">int x = 5;</code></pre>
			</div>


			<!-- TODO: Make Dynamic -->
			<div class="mb-5">
				<h4 class="mb-4">Objects Updated</h4>
				<pre>flags[device]: 21</pre>
			</div>

			<div class="container justify-content-center">
				<div class="text-center mb-4">
					<h4>Data Transfer Count Heatmap</h4>
					<h6>{{np.sum(data)}} Total Data Transfers</h5>
				</div>
				<%
					include(
						"heatmap.tpl",
						id = "code-view-heatmap",
						width = "100%",
						height = "40vh",
						data   = data,
						x_axis = x_axis,
						y_axis = y_axis,
						ticks  = ticks,
						colorscale   = colorscale,
						x_axis_title = "Owner",
						y_axis_title = "Issued By"
					)
				%>
			</div>
		</div>
	</div>
</div>
