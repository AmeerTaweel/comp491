% include("head.tpl")

<title>Snoopie Visualizer</title>

<div class="container">
	<div class="row">
		<h1>Communication Issued By GPU{{device}}</h1>
	</div>
	<div class="row">
		<div class="col-6">
			<h2>Objects</h2>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Object</th>
						<th scope="col">Count</th>
						<th scope="col">Destination</th>
					</tr>
				</thead>
				<tbody>
					% for i in objects:
					<tr>
						<td>{{i[0]}}</td>
						<td>{{i[1]}}</td>
						<td>{{i[2]}}</td>
					</tr>
					% end
				</tbody>
			</table>
		</div>
		<div class="col-6">
			<h2>Code Lines</h2>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Code Line</th>
						<th scope="col">Count</th>
						<th scope="col">Destination</th>
					</tr>
				</thead>
				<tbody>
					% for i in code_lines:
					<tr>
						<td>{{i[0]}}</td>
						<td>{{i[1]}}</td>
						<td>{{i[2]}}</td>
					</tr>
					% end
				</tbody>
			</table>
		</div>
		<div class="col-6">
			<h2>Instructions</h2>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Instruction</th>
						<th scope="col">Count</th>
						<th scope="col">Destination</th>
					</tr>
				</thead>
				<tbody>
					% for i in instructions:
					<tr>
						<td>{{i[0]}}</td>
						<td>{{i[1]}}</td>
						<td>{{i[2]}}</td>
					</tr>
					% end
				</tbody>
			</table>
		</div>
	</div>
</div>
