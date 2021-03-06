﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace BrowserBlast
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.RouteExistingFiles = false;
			//routes.MapRoute(
			//	name: "Relay",
			//	url: "Relay/{url}",
			//	defaults: new { controller = "Relay", action = "Index" }
			//);

			routes.MapRoute(
				name: "Default",
				url: "{controller}/{action}/{id}",
				defaults: new { controller = "Game", action = "Index", id = UrlParameter.Optional }
			);

			
		}
	}
}
