using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BrowserBlast.Controllers;
using System.Web;
using HtmlAgilityPack;


namespace BrowserBlast.Test
{
	[TestClass]
	public class UnitTest1
	{
		[TestMethod]
		public void TestURL()
		{
            System.Diagnostics.Debug.WriteLine("ppoop");
            RelayController test = new RelayController();
            //HtmlDocument poop = test.Index("www.google.com");
            System.Diagnostics.Debug.WriteLine("???"+test.Index("www.google.com").ToString());
            System.Diagnostics.Debug.WriteLine("ppoop1");
		}
	}
}
