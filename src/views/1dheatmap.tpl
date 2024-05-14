% import numpy as np

% setdefault("font_size_colorscale", 5)
% setdefault("font_size_x_axis",     5)
% setdefault("font_size_y_axis",     5)
% setdefault("font_size_axis_title", 7)

% setdefault("no_axis_thresh", 20)

% setdefault("x_axis_title", "")
% setdefault("y_axis_title", "")
% setdefault("ratio_x_axis_title", 0.07 if len(x_axis_title) > 0 else 0)
% setdefault("ratio_y_axis_title", 0.07 if len(y_axis_title) > 0 else 0)

% # Axis width and height ratio
% setdefault("ratio_axis", 0.1)
% # Heatmap width ratio
% setdefault("ratio_map", 0.78)
% # Gap 1 width ratio
% setdefault("ratio_gap1", 0.02)
% # Color bar width ratio
% setdefault("ratio_bar", 0.33)
% # Gap 2 width ratio
% setdefault("ratio_gap2", 0.07)

% setdefault("ratio_axis_tick", 0.1)

% line_spacing = 10

<% vals_dict = { 
	"v_adj_list"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"v_adj_begin"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"v_adj_length"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"flags"			: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"loc_in_queue"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"loc_out_queue"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"glob_queue"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"queue_to_push"	: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9], 
	"result"		: [10,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9]
	}
%>

% # Adjust for hidden axis
% show_axis    = max(np.shape(data)) <= no_axis_thresh
% ratio_axis = ratio_axis if show_axis else 0
% ratio_map  = (1 - ratio_y_axis_title - ratio_axis) * ratio_map
% ratio_gap1 = (1 - ratio_y_axis_title - ratio_axis) * ratio_gap1

% # Viewbox width and height
% setdefault("vw", 200)
% vh = round(vw * (ratio_x_axis_title + ratio_axis + ratio_map))

<div id="{{id}}">
	<style>
		#{{id}} > svg {
			display: block;
			shape-rendering: crispEdges;
			width : {{width}};
			height: {{height}};
		}

		#{{id}} > svg line {
			stroke: black;
		}

		#{{id}} > svg :not(.colorscale-bar) rect {
			stroke: black;
			stroke-width: 0.25;
		}

		#{{id}} > svg .colorscale-ticks {
			font: {{font_size_colorscale}}px monospace;
		}

		#{{id}} > svg .x-axis {
			font: {{font_size_x_axis}}px monospace;
		}

		#{{id}} > svg .y-axis {
			font: {{font_size_y_axis}}px monospace;
		}

		#{{id}} > svg .ax-title {
			font: {{font_size_axis_title}}px sans-serif;
		}

		#{{id}} > svg .x-axis > text{
			transform-box: fill-box;
			transform-origin: center;
			transform: rotate(75deg);
		}

		#{{id}} > svg .y-axis-title > text {
			transform-box: fill-box;
			transform-origin: center;
			transform: rotate(-90deg);
		}
	</style>

	% size_ax         = round(vw * ratio_axis)
	% size_ax_x_title = round(vw * ratio_x_axis_title)
	% size_ax_y_title = round(vw * ratio_y_axis_title)

	% w_gap1  = round(vw * ratio_gap1)
	% w_map   = round(vw * ratio_map)
	% w_scale = vw - (size_ax + w_gap1 + w_map)
	% w_bar   = round(w_scale * ratio_bar)
	% w_gap2  = round(w_scale * ratio_gap2)

	<svg viewBox="1 0 {{vw}} {{vh}}" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">
		<!-- X-Axis Title -->
		<g class="x-axis-title">
			% w = round(w_map, 2)
			% h = round(size_ax_x_title, 2)
			% x = round(size_ax_y_title + size_ax + w / 2, 2)
			% y = round(vh - h / 4, 2)
			<text class="ax-title" text-anchor="middle" x="{{x}}" y="{{y}}" width="{{w}}" height="{{h}}">{{x_axis_title}}</text>
		</g>
		<!-- X-Axis -->
		% if show_axis:
		<g class="x-axis">

			% x1 = round(size_ax_y_title + size_ax, 2)
			% x2 = round(x1 + w_map, 2)
			% y  = round(vh - size_ax - size_ax_x_title, 2)

			% cols = np.shape(data)[1]
			% rows = len(vals_dict)

			% for row in range(rows):
				% h  = round((vh - size_ax - size_ax_x_title) / rows, 2)
				% y_new  = round(row * h + 0.5 * h, 2) - (h/4)
				% for col in range(len(x_axis) - 1):
					% w = round(w_map / cols, 2)/4
					% x  = round(size_ax_y_title + size_ax, 2) + (10 * col * w)
					% y1 = round((vh - size_ax - size_ax_x_title), 2) - y_new
					% y2 = round((vh - size_ax - size_ax_x_title) + size_ax * ratio_axis_tick, 2) - y_new
					<line x1="{{x}}" y1="{{y1}}" x2="{{x}}" y2="{{y2}}"/>
				% end
			% end

			% for col in range(len(x_axis)):
				% w = round(w_map / cols, 2)/4
				% h = round(size_ax - size_ax * ratio_axis_tick, 2)
				% x  = round(size_ax_y_title + size_ax, 2) + (10 * col * w)
				% y = round(vh - size_ax_x_title - h / 4, 2)
				<text text-anchor="middle" x="{{x}}" y="{{y}}" width="{{w}}" height="{{h}}">{{x_axis[col]}}</text>
			% end
		</g>
		% end
		<!-- Y-Axis Title -->
		<g class="y-axis-title">
			% w = round(vh - size_ax - size_ax_y_title, 2)
			% h = round(size_ax_y_title, 2)
			% x = round(h / 2, 2)
			% y = round(w / 2, 2)
			<text class="ax-title" text-anchor="middle" x="{{x}}" y="{{y}}" width="{{w}}" height="{{h}}">{{y_axis_title}}</text>
		</g>
		<!-- Y-Axis -->
		% if show_axis:
		<g class="y-axis">

			% x  = round(size_ax_y_title + size_ax, 2)
			% y1 = round(0, 2)
			% y2 = round(vh - size_ax - size_ax_x_title, 2)

			% rows = len(vals_dict)

			% for row in range(rows):
				% h  = round((vh - size_ax - size_ax_x_title) / rows, 2)
				% x1 = round(size_ax_y_title + size_ax - size_ax * ratio_axis_tick, 2)
				% x2 = w
				% y  = round(row * h + 0.5 * h, 2)
				<line x1="{{x1}}" y1="{{y}}" x2="{{x2}}" y2="{{y}}"/>
			% end

			% for row, key in enumerate(vals_dict.keys()): 
				% h = round((vh - size_ax - size_ax_x_title) / rows, 2)
				% w = round(size_ax - size_ax * ratio_axis_tick, 2)

				% # TODO: Fix len of the x coodranite for keys
				% x = round(size_ax_y_title + 1, 2) - len(key)*2

				% y = round(row * h + 0.5 * h + 0.5 * font_size_y_axis, 2)
				<text x="{{x}}" y="{{y}}" width="{{w - 1}}" height="{{h}}">{{key}}</text>
			% end
		</g>
		% end
		<!-- Map -->
		<g>
			% rows = len(vals_dict)
			% cols = np.shape(data)[1]
			% w = round(w_map / cols, 2)/4
			% h = round((vh - size_ax - size_ax_x_title) / rows, 2)
			% dmin = np.min(data)
			% dmax = np.max(data)
			% for row in range(rows):
				% for col in range(cols):
					% x = round(col * w + size_ax_y_title + size_ax, 2)
					% y = round(row * h, 2) + h/4
					% d = (data[row][col] - dmin) / (dmax - dmin)
					% f = colorscale(d).hexcode
					<rect x="{{x}}" y="{{y}}" width="{{w}}" height="{{h/2}}" fill="{{f}}"/>
				% end
			% end
		</g>
		<!-- Colorscale Bar -->
		<g class="colorscale-bar">
		% for i, v in enumerate(range(vh - size_ax - size_ax_x_title, 0, -1)):
			% x = round(size_ax_y_title + size_ax + w_map + w_gap1, 2)
			% w = round(w_bar, 2)
			% f = colorscale(v / (vh - size_ax)).hexcode

			<rect x="{{x}}" y="{{i}}" width="{{w}}" height="1" fill="{{f}}"/>
		% end
		</g>
		<!-- Colorscale Ticks -->
		<g class="colorscale-ticks">
		% for t in ticks:
			% tmin = min(ticks)
			% tmax = max(ticks)

			% x = round(size_ax_y_title + size_ax + w_map + w_gap1 + w_bar + w_gap2, 2)
			% y = round((1 - ((t - tmin) / (tmax - tmin))) * (vh - size_ax - size_ax_x_title), 2)
			% y = round(y + font_size_colorscale if t == tmax else y, 2)

			% w = round(vw - x, 2)
			% h = round(font_size_colorscale, 2)

			<text x="{{x}}" y="{{y}}" width="{{w}}" height="{{h}}">{{t}}</text>
		% end
		</g>
	</svg>
</div>
