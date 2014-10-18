using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace BrowserBlast
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/js").Include(
				"~/Scripts/jquery-1.10.2.js",
				"~/Scripts/jquery.signalR-2.1.2.js"));

			bundles.Add(new ScriptBundle("~/bundles/ts").Include(
				"~/Scripts/ts/Game.js",
				"~/Scripts/ts/GameHub.js",
				"~/Scripts/ts/Pointer.js"
				));

			bundles.Add(new StyleBundle("~/Content/css").Include(
				 "~/Content/bootstrap.css",
				 "~/Content/Site.css"));

			// Set EnableOptimizations to false for debugging. For more information,
			// visit http://go.microsoft.com/fwlink/?LinkId=301862
#if !DEBUG
			BundleTable.EnableOptimizations = true;
#endif
		}
	}
}
