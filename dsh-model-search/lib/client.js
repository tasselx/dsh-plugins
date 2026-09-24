window.__ModuleLoader__.load({
	id: "dsh-model-search",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const ReactDOM = require("react-dom");
		const { jsx, jsxs, Fragment } = require("react/jsx-runtime");
		const primitives = require("@deepseek-ai/dsh-client-ui-primitives");

		//#region dictionaries
		/**
		 * `modelSearch` namespace dictionaries. The plugin owns its own copy rather
		 * than borrowing the shipped `model` namespace, so the seat keeps working
		 * unchanged if the shipped selector is ever disabled or reworded.
		 */
		const zh = {
			"trigger.fallback": "选择模型",
			"trigger.loading": "正在加载模型…",
			"trigger.aria": "选择模型，当前 {model}",
			"trigger.ariaEffort": "选择模型，当前 {model}，推理等级 {effort}",
			"menu.aria": "模型与推理等级",
			"menu.model": "模型",
			"menu.effort": "推理等级",
			"effort.default": "Default",
			"status.loading": "正在刷新模型列表…",
			"error.action": "模型操作失败：{message}",
			"warning.groupLoad": "{name} 加载失败：{message}",
			"action.reload": "重新加载",
			"empty.models": "没有可用的模型。",
			"empty.efforts": "当前模型未提供推理等级。",
			"search.placeholder": "搜索模型或提供方…",
			"search.aria": "搜索模型",
			"search.empty": "没有匹配的模型。"
		};
		const en = {
			"trigger.fallback": "Select model",
			"trigger.loading": "Loading models…",
			"trigger.aria": "Select model, current {model}",
			"trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
			"menu.aria": "Model and reasoning effort",
			"menu.model": "Model",
			"menu.effort": "Effort",
			"effort.default": "Default",
			"status.loading": "Refreshing model list…",
			"error.action": "Model operation failed: {message}",
			"warning.groupLoad": "{name} failed to load: {message}",
			"action.reload": "Reload",
			"empty.models": "No models available.",
			"empty.efforts": "This model provides no reasoning effort levels.",
			"search.placeholder": "Search models or providers…",
			"search.aria": "Search models",
			"search.empty": "No matching models."
		};
		//#endregion

		//#region styles
		/** Scoped class names: one prefix keeps this seat's rules off the shipped ones. */
		const CLASS_NAMES = [
			"root",
			"trigger",
			"triggerIcon",
			"triggerLabel",
			"triggerEffort",
			"chevron",
			"chevronOpen",
			"menu",
			"search",
			"searchInput",
			"searchEmpty",
			"groups",
			"group",
			"groupTitle",
			"option",
			"optionCopy",
			"modelName",
			"check",
			"selected",
			"cell",
			"cellLabel",
			"cellValue",
			"cellChevron",
			"status",
			"empty",
			"error",
			"warning",
			"retry"
		];
		const css = Object.fromEntries(CLASS_NAMES.map((name) => [name, `_dms_${name}`]));
		const STYLE = [
			"._dms_root{min-width:0;position:relative}",
			"._dms_trigger{min-width:0;max-width:min(360px,45cqw);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:24px;outline:none;align-items:center;gap:4px;padding:0 4px 0 8px;font-size:13px;font-weight:500;line-height:20px;display:flex}",
			"._dms_trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
			"._dms_trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}",
			"._dms_trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}",
			"._dms_triggerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}",
			"._dms_triggerEffort{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-caption);flex-shrink:1000;overflow:hidden}",
			"._dms_triggerIcon{flex:none;display:none}",
			"@container (width<=360px){._dms_triggerIcon{display:block}._dms_triggerLabel,._dms_triggerEffort{display:none}}",
			"._dms_chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}",
			"._dms_chevronOpen{transform:rotate(180deg)}",
			"._dms_menu{z-index:1100;background:var(--dsw-specific-menu);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);width:max-content;min-width:min(280px,100vw - 32px);max-width:min(460px,100vw - 32px);max-height:min(400px,100vh - 96px);box-shadow:var(--dsw-elevation-prominent);color:var(--dsw-alias-label-primary);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border:0;border-radius:20px;flex-direction:column;padding:4px;display:flex;position:fixed;overflow:hidden}",
			"._dms_search{background:var(--dsw-specific-menu);border-bottom:1px solid var(--dsw-alias-border-l1);padding:4px 6px 6px}",
			"._dms_searchInput{box-sizing:border-box;width:100%;height:32px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);border:1px solid transparent;border-radius:10px;outline:none;padding:0 10px;font-family:inherit;font-size:13px;line-height:20px}",
			"._dms_searchInput::placeholder{color:var(--dsw-alias-label-tertiary)}",
			"._dms_searchInput:focus{border-color:var(--dsw-alias-border-l3)}",
			"._dms_searchEmpty,._dms_status,._dms_empty{color:var(--dsw-alias-label-tertiary);padding:10px;font-size:13px;line-height:20px}",
			"._dms_error,._dms_warning{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:8px;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;padding:7px 8px;font-size:12px;line-height:18px;display:flex}",
			"._dms_warning{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-state-warn-label)}",
			"._dms_retry{color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;flex:none;padding:0;font-weight:600}",
			"._dms_groups{min-height:0;overflow-y:auto}",
			"._dms_group+._dms_group{margin-top:4px}",
			"._dms_groupTitle{z-index:1;background:var(--dsw-specific-menu);color:var(--dsw-alias-label-tertiary);padding:5px 8px 3px;font-size:12px;font-weight:500;line-height:18px;position:sticky;top:0}",
			"._dms_option{box-sizing:border-box;width:auto;min-width:100%;min-height:38px;color:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:10px;outline:none;align-items:center;gap:8px;padding:6px 8px;display:flex}",
			"._dms_option:hover:not(:disabled),._dms_option:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}",
			"._dms_selected{background:0 0}",
			"._dms_option:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}",
			"._dms_optionCopy{flex-direction:column;flex:1;min-width:0;display:flex}",
			"._dms_modelName{color:inherit;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:500;line-height:20px;overflow:hidden}",
			"._dms_check{color:var(--dsw-alias-label-primary);flex:0 0 18px;place-items:center;display:grid}",
			"._dms_cell{box-sizing:border-box;width:auto;min-width:100%;height:40px;color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:10px;align-items:center;gap:8px;padding:0 10px;font-size:14px;line-height:22px;display:flex}",
			"._dms_cell:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			"._dms_cellLabel{white-space:nowrap;flex:none}",
			"._dms_cellValue{text-overflow:ellipsis;white-space:nowrap;text-align:right;min-width:0;color:var(--dsw-alias-label-tertiary);flex:auto;overflow:hidden}",
			"._dms_cellChevron{color:var(--dsw-alias-label-tertiary);flex:none}"
		].join("");
		const STYLE_TAG_ID = "dsh-model-search/styles";
		/** Append this plugin's stylesheet once, and remove it when the plugin unloads. */
		function installStyles() {
			if (typeof document === "undefined") return () => {};
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(STYLE_TAG_ID) + "]") !== null) return () => {};
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-model-search";
			tag.dataset.pluginCss = STYLE_TAG_ID;
			tag.textContent = STYLE;
			document.head.appendChild(tag);
			return () => {
				tag.remove();
			};
		}
		//#endregion

		//#region seat
		/**
		 * Model seat with search. The composer's `conversation.input.model` seat is
		 * `single`: its occupants sort by ascending priority and only the first one
		 * renders, so this plugin claims it with a negative priority and shadows the
		 * shipped selector without disabling its row — the shared per-session
		 * directory service (`ctx.modelDirectories`) and the `/model` popup keep
		 * running from the shipped package.
		 */
		const SLOT_PRIORITY = -1000;
		const NS = "modelSearch";
		/** Unplaced portal card: hidden but laid out at a fixed origin so offsetWidth/offsetHeight are real. */
		const MEASURE_STYLE = {
			visibility: "hidden",
			left: 0,
			top: 0
		};

		/** Case-insensitive: every whitespace-separated term must appear in the provider or model name/id. */
		function modelMatches(group, model, terms) {
			if (terms.length === 0) return true;
			const haystack = `${group.name} ${group.id} ${model.name} ${model.id}`.toLowerCase();
			return terms.every((term) => haystack.includes(term));
		}

		/**
		 * Render the composer model seat with a search box over the provider-grouped list.
		 * @param props - owner share (locked) + injected face (shared directory store/verbs) + locale seat.
		 * @returns the trigger and, while open, the two-level menu.
		 */
		function ModelSearchSelect({ locked, available, directory, load, select, t }) {
			const state = React.useSyncExternalStore((fn) => directory.subscribe(fn), () => directory.getSnapshot());
			const [open, setOpen] = React.useState(false);
			const [pane, setPane] = React.useState("root");
			const [query, setQuery] = React.useState("");
			const [menuPos, setMenuPos] = React.useState(null);
			const [toast, setToast] = React.useState(null);
			const lastActionRef = React.useRef("load");
			const toastSeq = React.useRef(0);
			const rootRef = React.useRef(null);
			const triggerRef = React.useRef(null);
			const menuRef = React.useRef(null);
			const itemRefs = React.useRef([]);
			const id = React.useId();
			const choices = React.useMemo(() => state.groups.flatMap((group) => group.models.map((model) => ({
				group,
				model
			}))), [state.groups]);
			const visibleGroups = React.useMemo(() => {
				const terms = query.trim().toLowerCase().split(/\s+/).filter((term) => term !== "");
				if (terms.length === 0) return state.groups;
				return state.groups.map((group) => ({
					...group,
					models: group.models.filter((model) => modelMatches(group, model, terms))
				})).filter((group) => group.models.length > 0);
			}, [state.groups, query]);
			const currentChoice = choices[state.current === null ? -1 : choices.findIndex((c) => c.group.id === state.current?.provider && c.model.id === state.current.model)];
			const reasoning = currentChoice?.model.reasoning;
			const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
			const effortLabel = reasoning === void 0 ? void 0 : effectiveEffort === void 0 ? t("effort.default") : reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort;
			const effortChoices = React.useMemo(() => reasoning === void 0 ? [] : [...reasoning.defaultEffort === void 0 ? [{
				key: "provider-default",
				effort: void 0,
				label: t("effort.default")
			}] : [], ...reasoning.efforts.map((effort) => ({
				key: `effort:${effort.id}`,
				effort: effort.id,
				label: effort.name
			}))], [reasoning, t]);
			const busy = state.status === "selecting";
			const reload = () => {
				lastActionRef.current = "load";
				load();
			};
			React.useEffect(() => {
				if (!open) return;
				const closeOutside = (event) => {
					if (rootRef.current?.contains(event.target) === true) return;
					if (menuRef.current?.contains(event.target) === true) return;
					setOpen(false);
				};
				document.addEventListener("mousedown", closeOutside);
				return () => {
					document.removeEventListener("mousedown", closeOutside);
				};
			}, [open]);
			React.useLayoutEffect(() => {
				if (!open) {
					setMenuPos(null);
					return;
				}
				const place = () => {
					const rect = triggerRef.current?.getBoundingClientRect();
					if (rect === void 0) return;
					const MARGIN = 12;
					const width = menuRef.current?.offsetWidth ?? 0;
					const height = menuRef.current?.offsetHeight ?? 0;
					let x = rect.right - width;
					let y = rect.top - 8 - height;
					if (width > 0) x = Math.min(Math.max(x, MARGIN), window.innerWidth - width - MARGIN);
					if (height > 0) y = Math.min(Math.max(y, MARGIN), window.innerHeight - height - MARGIN);
					setMenuPos({
						left: x,
						top: y
					});
				};
				place();
				window.addEventListener("scroll", place, true);
				window.addEventListener("resize", place);
				return () => {
					window.removeEventListener("scroll", place, true);
					window.removeEventListener("resize", place);
				};
			}, [
				open,
				pane,
				state
			]);
			if (!available) return null;
			const show = () => {
				setPane("root");
				setQuery("");
				setOpen(true);
				reload();
			};
			const close = (restoreFocus = false) => {
				setOpen(false);
				setPane("root");
				setQuery("");
				if (restoreFocus) queueMicrotask(() => {
					triggerRef.current?.focus();
				});
			};
			const moveFocus = (offset) => {
				const items = itemRefs.current.filter((item) => item !== null);
				if (items.length === 0) return;
				const active = items.findIndex((item) => item === document.activeElement);
				const next = active < 0 ? offset > 0 ? 0 : items.length - 1 : (active + offset + items.length) % items.length;
				items[next]?.focus();
			};
			const onRootKeyDown = (event) => {
				if (event.key === "Escape" && open) {
					event.preventDefault();
					if (pane !== "root") setPane("root");
					else close(true);
					return;
				}
				if (!open) return;
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					moveFocus(event.key === "ArrowDown" ? 1 : -1);
				}
			};
			/** Search-box keys: Escape clears then returns, Enter takes the first visible model, arrows walk the list. */
			const onSearchKeyDown = (event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					event.stopPropagation();
					if (query !== "") setQuery("");
					else setPane("root");
					return;
				}
				if (event.key === "Enter") {
					event.preventDefault();
					const group = visibleGroups[0];
					const model = group?.models[0];
					if (group !== void 0 && model !== void 0) choose({
						provider: group.id,
						model: model.id
					});
					return;
				}
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					moveFocus(event.key === "ArrowDown" ? 1 : -1);
				}
			};
			const onBlur = (event) => {
				if (event.relatedTarget instanceof Node && (rootRef.current?.contains(event.relatedTarget) === true || menuRef.current?.contains(event.relatedTarget) === true)) return;
				close();
			};
			const settleSelection = (accepted) => {
				if (accepted) {
					if (rootRef.current !== null) close(true);
					return;
				}
				const message = directory.getSnapshot().error;
				if (message !== null) {
					toastSeq.current += 1;
					setToast({
						seq: toastSeq.current,
						text: t("error.action", { message })
					});
				}
			};
			const choose = (selection) => {
				if (state.current?.provider === selection.provider && state.current.model === selection.model) {
					close(true);
					return;
				}
				lastActionRef.current = "select";
				select(selection).then(settleSelection);
			};
			const chooseEffort = (effort) => {
				if (state.current === null) return;
				if (effectiveEffort === effort) {
					close(true);
					return;
				}
				const selection = {
					provider: state.current.provider,
					model: state.current.model,
					...effort === void 0 ? {} : { reasoningEffort: effort }
				};
				lastActionRef.current = "select";
				select(selection).then(settleSelection);
			};
			const waiting = state.current === null && state.status === "loading";
			const modelLabel = waiting ? t("trigger.loading") : currentChoice?.model.name ?? (state.current === null ? t("trigger.fallback") : `${state.current.provider}/${state.current.model}`);
			const triggerLabel = effortLabel === void 0 ? modelLabel : `${modelLabel} · ${effortLabel}`;
			const triggerAria = waiting ? t("trigger.loading") : state.current === null ? t("trigger.fallback") : effortLabel === void 0 ? t("trigger.aria", { model: modelLabel }) : t("trigger.ariaEffort", {
				model: modelLabel,
				effort: effortLabel
			});
			itemRefs.current = [];
			let itemIndex = 0;
			const itemRef = () => {
				const at = itemIndex++;
				return (node) => {
					itemRefs.current[at] = node;
				};
			};
			const filtered = query.trim() !== "";
			return jsxs("div", {
				ref: rootRef,
				className: css.root,
				onKeyDown: onRootKeyDown,
				onBlur,
				children: [
					jsxs("button", {
						ref: triggerRef,
						type: "button",
						className: css.trigger,
						"aria-label": triggerAria,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						"aria-controls": open ? `${id}-menu` : void 0,
						title: triggerLabel,
						disabled: locked,
						onClick: () => {
							if (open) close();
							else show();
						},
						children: [
							jsx(primitives.IconDataOutline16, {
								className: css.triggerIcon,
								size: 16
							}),
							jsx("span", {
								className: css.triggerLabel,
								children: modelLabel
							}),
							effortLabel !== void 0 && jsx("span", {
								className: css.triggerEffort,
								children: effortLabel
							}),
							jsx(primitives.IconChevronDownOutline14, { className: open ? `${css.chevron} ${css.chevronOpen}` : css.chevron })
						]
					}),
					open && ReactDOM.createPortal(jsxs("div", {
						ref: menuRef,
						id: `${id}-menu`,
						className: css.menu,
						style: menuPos ?? MEASURE_STYLE,
						role: "menu",
						"aria-label": t("menu.aria"),
						"aria-busy": state.status === "loading" || busy,
						children: [
							pane === "root" && jsxs(Fragment, { children: [jsxs("button", {
								ref: itemRef(),
								type: "button",
								role: "menuitem",
								className: css.cell,
								onClick: () => {
									setQuery("");
									setPane("model");
								},
								children: [jsx("span", {
									className: css.cellLabel,
									children: t("menu.model")
								}), jsx("span", {
									className: css.cellValue,
									children: modelLabel
								}), jsx(primitives.IconChevronRightOutline14, { className: css.cellChevron })]
							}), reasoning !== void 0 && jsxs("button", {
								ref: itemRef(),
								type: "button",
								role: "menuitem",
								className: css.cell,
								onClick: () => {
									setPane("effort");
								},
								children: [jsx("span", {
									className: css.cellLabel,
									children: t("menu.effort")
								}), jsx("span", {
									className: css.cellValue,
									children: effortLabel
								}), jsx(primitives.IconChevronRightOutline14, { className: css.cellChevron })]
							})] }),
							pane === "model" && jsxs(Fragment, { children: [
								jsx("div", {
									className: css.search,
									children: jsx("input", {
										type: "text",
										className: css.searchInput,
										value: query,
										placeholder: t("search.placeholder"),
										"aria-label": t("search.aria"),
										autoFocus: true,
										disabled: busy,
										onChange: (event) => {
											setQuery(event.target.value);
										},
										onKeyDown: onSearchKeyDown
									})
								}),
								state.status === "loading" && jsx("div", {
									className: css.status,
									children: t("status.loading")
								}),
								state.error !== null && lastActionRef.current === "load" && jsxs("div", {
									className: css.error,
									children: [jsx("span", { children: t("error.action", { message: state.error }) }), jsx("button", {
										type: "button",
										className: css.retry,
										onClick: reload,
										children: t("action.reload")
									})]
								}),
								state.failures.map((failure) => jsxs("div", {
									className: css.warning,
									children: [jsx("span", { children: t("warning.groupLoad", {
										name: failure.name,
										message: failure.message
									}) }), jsx("button", {
										type: "button",
										className: css.retry,
										onClick: reload,
										children: t("action.reload")
									})]
								}, failure.id)),
								jsx("div", {
									className: `${css.groups} scrollable`,
									children: visibleGroups.map((group) => {
										const headingId = `${id}-${group.id}`;
										return jsxs("section", {
											role: "group",
											"aria-labelledby": headingId,
											className: css.group,
											children: [jsx("div", {
												className: css.groupTitle,
												id: headingId,
												children: group.name
											}), group.models.map((model) => {
												const selected = state.current?.provider === group.id && state.current.model === model.id;
												return jsxs("button", {
													ref: itemRef(),
													type: "button",
													role: "menuitemradio",
													"aria-checked": selected,
													className: selected ? `${css.option} ${css.selected}` : css.option,
													title: model.name,
													disabled: busy,
													onClick: () => {
														choose({
															provider: group.id,
															model: model.id
														});
													},
													children: [jsx("span", {
														className: css.optionCopy,
														children: jsx("span", {
															className: css.modelName,
															children: model.name
														})
													}), jsx("span", {
														className: css.check,
														children: selected ? jsx(primitives.IconCheckOutline16, {}) : null
													})]
												}, model.id);
											})]
										}, group.id);
									})
								}),
								state.status === "ready" && filtered && visibleGroups.length === 0 && jsx("div", {
									className: css.searchEmpty,
									children: t("search.empty")
								}),
								state.status === "ready" && !filtered && choices.length === 0 && jsx("div", {
									className: css.empty,
									children: t("empty.models")
								})
							] }),
							pane === "effort" && jsxs(Fragment, { children: [state.error !== null && lastActionRef.current === "load" && jsxs("div", {
								className: css.error,
								children: [jsx("span", { children: t("error.action", { message: state.error }) }), jsx("button", {
									type: "button",
									className: css.retry,
									onClick: reload,
									children: t("action.reload")
								})]
							}), effortChoices.length === 0 ? jsx("div", {
								className: css.empty,
								children: t("empty.efforts")
							}) : effortChoices.map((level) => jsxs("button", {
								ref: itemRef(),
								type: "button",
								role: "menuitemradio",
								"aria-checked": effectiveEffort === level.effort,
								className: effectiveEffort === level.effort ? `${css.option} ${css.selected}` : css.option,
								disabled: busy,
								onClick: () => {
									chooseEffort(level.effort);
								},
								children: [jsx("span", {
									className: css.optionCopy,
									children: jsx("span", {
										className: css.modelName,
										children: level.label
									})
								}), jsx("span", {
									className: css.check,
									children: effectiveEffort === level.effort ? jsx(primitives.IconCheckOutline16, {}) : null
								})]
							}, level.key))] })
						]
					}), document.body),
					toast !== null && jsx(primitives.Toast, {
						text: toast.text,
						icon: jsx(primitives.IconWarningOutline16, {}),
						anchor: rootRef.current?.closest("[data-composer-card]") ?? null,
						onDone: () => {
							setToast(null);
						}
					}, toast.seq)
				]
			});
		}
		//#endregion

		//#region plugin
		/** Required services: the seat registry, the shared model directory service, and session addressing. */
		const inject = ["locale", "slots"];
		/**
		 * Client plugin body: register this seat's copy, then claim the composer's
		 * model seat over the shipped selector with a winning priority.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => installStyles(), "model-search: styles");
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "model-search: dictionaries");
			ctx.inject(["slots", "modelDirectories", "sessions"], (scope) => {
				const models = scope.modelDirectories;
				const sessions = scope.sessions;
				scope.slots.inject("conversation.input.model", () => scope.slots.register({
					name: "conversation.input.model",
					priority: SLOT_PRIORITY,
					locale: NS,
					inject: (sessionId) => {
						const directory = models.directoryFor(sessionId);
						const available = sessions.subagentAddress(sessionId) === void 0;
						return {
							available,
							directory: directory.store,
							load: () => {
								if (available) directory.load().catch(() => {});
							},
							select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
						};
					}
				}, ModelSearchSelect));
			});
		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		exports.name = "model-search";
		return module.exports;
	}
});
