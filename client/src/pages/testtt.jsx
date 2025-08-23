<div className="w-[450px]  overflow-hidden">
                    <div
                      ref={facultyRef}
                      className="flex gap-4  overflow-x-auto no-scrollbar"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      {faculty.map((f, idx) => (
                        <div
                          key={idx}
                          className="shrink-0 w-[190px] glass-card rounded-xl p-4 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30"
                        >
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center shadow-lg border-2  border-cyan-400">
                            {f.photo ? (
                              <img
                                src={f.photo}
                                alt={f.name}
                                className="w-full h-full object-cover "
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="text-white font-bold text-lg">
                                {f.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="text-white font-semibold text-sm mb-2">
                            {f.name}
                          </div>
                          <div className="text-slate-300 text-xs font-medium mb-1">
                            {f.role}
                          </div>
                          <div className="text-cyan-400 text-xs">
                            <b>{f.dept}</b>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>